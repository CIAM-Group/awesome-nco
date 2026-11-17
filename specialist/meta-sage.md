---
id: meta-sage
short_title: Meta-SAGE
title: 'Meta-SAGE: Scale Meta-Learning Scheduled Adaptation with Guided Exploration for Mitigating Scale Shift on
  Combinatorial Optimization'
authors:
- Jiwoo Son
- Minsu Kim
- Hyeonah Kim
- Jinkyoo Park
year: 2023
date: '2023-06-05'
venue: ICML
paper_url: https://proceedings.mlr.press/v202/son23a.html
arxiv_url: https://arxiv.org/abs/2306.02688
institutions:
- KAIST
scope: specialist
paradigm: constructive
problem_families:
- Routing
problems:
- Traveling Salesman Problem
- Capacitated Vehicle Routing Problem
- Prize Collecting Traveling Salesman Problem
- Orienteering Problem
summary: Meta-SAGE distills scale-aware embedding initializations and adapts small decoder modules per instance
  with decaying distance bias and temperature.
figure:
  path: paper-assets/meta-sage/framework.png
  alt: Meta-SAGE module adapting latent features between an encoder and decoder.
  caption: 'Figure 2: Meta-SAGE adaptation module for size-generalizable routing.'
  source_url: https://proceedings.mlr.press/v202/son23a/son23a.pdf#page=4
publication:
  date: '2023-07-03'
  source_url: https://proceedings.mlr.press/v202/son23a.html
code_url: https://github.com/kaist-silab/meta-sage
---

# Meta-SAGE: Scale Meta-Learning Scheduled Adaptation with Guided Exploration for Mitigating Scale Shift on Combinatorial Optimization

> **TL;DR:** Meta-SAGE distills scale-aware embedding initializations and adapts small decoder modules per instance with decaying distance bias and temperature. It improves large-scale adaptation of existing task-specific routing policies, with substantial inference-time optimization costs.

## Motivation

Policies trained on size-100 routing instances can fail badly at 500 or 1000 nodes. Full active search is expensive, and updating only small modules still starts from a scale-mismatched representation. Meta-SAGE combines an offline scale meta-learner (SML) with per-instance scheduled adaptation with guided exploration (SAGE), using scale information to improve the starting representation and a distance bias to guide early sampling. [Sections 1-3.](https://proceedings.mlr.press/v202/son23a/son23a.pdf#page=1)

## Contributions

- SML transforms a frozen pretrained model's context using the target node count.
- A distillation-plus-policy-gradient objective amortizes the result of per-instance adaptation, avoiding direct differentiation through an entire bi-level search.
- SAGE adds a distance penalty to next-node logits, then decays that bias and the sampling temperature while adapting a small residual module.
- Tests cover **TSP, CVRP, PCTSP and OP**, with POMO and Sym-NCO backbones and cross-distribution CVRPLIB experiments. These are separately pretrained task models, not one checkpoint covering four tasks. [Sections 3-5.](https://proceedings.mlr.press/v202/son23a/son23a.pdf#page=3)

## Methodology

### Offline scale conditioning

The pretrained encoder produces context embeddings. A two-layer MLP embeds the node count; the resulting scale vector is added to the node/context representation and passed through another two-layer ReLU MLP. For SML training, the teacher target is the embedding obtained by sufficiently many SAGE updates without SML. The student minimizes squared embedding distance to that target and also maximizes a zero-adaptation policy objective. This is a practical distillation solution to the bi-level motivation, rather than ordinary end-to-end MAML through all search steps. [Section 4 and Appendix B.2.](https://proceedings.mlr.press/v202/son23a/son23a.pdf#page=4)

The pretrained policy weights remain frozen. Appendix B.2 reports L=4000 training instances sampled at sizes 200, 300 and 400; SML uses Adam learning rate 1e-3 and equal weight on the zero-shot objective. These intermediate-scale examples and their adaptation-generated embedding targets are additional offline work beyond the original size-100 backbone training. The official README's generation commands use **3000 instances per scale**, a configuration distinction to preserve when reproducing results. [Appendix B.2/B.4 and official code.](https://proceedings.mlr.press/v202/son23a/son23a.pdf#page=13)

### Instance-wise SAGE

The main schematic writes adapted embeddings as `g_eta(g_phi(h,N))`. Appendix B.3 specifies the memory-efficient implementation more precisely: the inserted two-layer 128-wide ReLU MLP makes a **residual update to the decoder's context query q-star**, following EAS. At test time only eta is updated; backbone theta and SML phi stay fixed. REINFORCE uses a mean sampled-return baseline, and self-imitation reinforces the best sampled solution with coefficient 0.005. [Figure 2 and Appendices B.2-B.4.](https://proceedings.mlr.press/v202/son23a/son23a.pdf#page=4)

Next-node logits subtract `alpha * distance(current,candidate)` before softmax. Alpha and temperature decay during adaptation, reducing the initial short-edge bias and shifting from exploration toward confident selection. Their stated initial values are one, with schedules reaching 0.3 at 200 updates. TSP/CVRP use K=200 updates; PCTSP/OP use K=100. At each update the policy constructs N times A candidates, where augmentation count A depends on scale; the final answer is the best among K times N times A sampled routes. This is neural-parameter adaptation followed by fresh **construction**, not a learned sequence of incumbent local moves. [Equations 3-6 and Appendix B.3-B.4.](https://proceedings.mlr.press/v202/son23a/son23a.pdf#page=14)

## Experiments

### Main scale-shift study

Size-100 POMO/Sym-NCO checkpoints are adapted to 200, 500 and 1000 nodes. Table 1 uses **1000 instances at size 200 and 128 at each larger size**, on one A100 40GB with an Intel Scalable Gold CPU. Times cover the **whole test set**. EAS and SGBS+EAS receive a runtime limit based on Meta-SAGE's budget; full AS instead receives the same 200 update iterations because it is not batched. Thus runtime matching and update-count matching are different comparison protocols. [Section 5 and Table 1.](https://proceedings.mlr.press/v202/son23a/son23a.pdf#page=5)

| Setting | Meta-SAGE result / dataset time | Relevant comparison |
| --- | --- | --- |
| Sym-NCO TSP200 | 10.728; 0.387% / 2.1 h | EAS 0.413% / 2.4 h |
| Sym-NCO TSP500 | 17.095; 3.339% / 3.8 h | EAS 9.986% / 4.3 h |
| Sym-NCO TSP1000 | 25.798; 11.488% / 18 h | EAS 35.017% / 20 h |
| POMO CVRP1000 | 121.114; 0.683% / 20 h | EAS 3.950% / 24 h |
| Sym-NCO PCTSP1000 | 16.219; -31.310% / 0.2 h | OR-Tools reference 23.611 |
| Sym-NCO OP500 | Prize 98.762 / 2.2 min | Compass reference 97.323 |

TSP gaps use Concorde optima. CVRP uses LKH-3, PCTSP OR-Tools and OP the classical **Compass orienteering solver**, which is unrelated to the later neural COMPASS paper. Negative gaps in minimization mean beating a heuristic reference, not proving optimality. For OP, larger prize is better; Table 1 reports its quality-oriented sign, whereas Appendix B.5's generic written minimization formula should not be applied unchanged. [Table 1 and Appendix B.5.](https://proceedings.mlr.press/v202/son23a/son23a.pdf#page=6)

The improvement over EAS is strong at large scale, but it does not eliminate TSP scale shift: TSP1000 retains an 11.488% gap. The authors explicitly identify an exception to the best-adaptation claim on Sym-NCO CVRP200: AS obtains 21.955 (-0.218%) versus Meta-SAGE 21.982 (-0.094%), at 28.2 h versus 2.7 h. HGS is not the main CVRP reference, although the paper acknowledges its stronger status. [Section 5.1 and footnote 3.](https://proceedings.mlr.press/v202/son23a/son23a.pdf#page=6)

### CVRPLIB and ablations

The X-instances study covers 100 benchmark instances of roughly 100-1000 customers, generated with heterogeneous location/demand patterns. Meta-SAGE improves EAS's mean cost in every reported size bin, but **LKH-3 is better in every bin**. For 900-1000 nodes, the costs are 172916 for Meta-SAGE, 175999 for EAS and 150332 for LKH-3. These benchmarks emulate varied applications rather than constitute a demonstrated operational deployment. [Table 2 and Appendix D.2, Table 8.](https://proceedings.mlr.press/v202/son23a/son23a.pdf#page=7)

On size-500 Sym-NCO, Table 3 moves TSP/CVRP costs from 18.63/63.97 with no components to 17.22/62.69 with SML, locality bias and both schedules. Scale-conditioning ablations show better results when the supplied size matches the instance; mean L1 embedding distance also falls with SML. The complete Appendix D.3 curves test distillation and the additional zero-adaptation RL objective, supporting contributions from both. [Tables 3-4, Figure 6 and Appendix D.3.](https://proceedings.mlr.press/v202/son23a/son23a.pdf#page=7)

## Limitations

### Reported by the Authors

- Non-Euclidean tasks such as scheduling are future extensions; the distance-based method is evaluated on Euclidean routing.
- Robustness to distribution shifts beyond scale remains challenging despite the CVRPLIB experiment.
- The method gives no optimality certificate or provable gap and does not establish general superiority over mathematical programming. [Section 6.](https://proceedings.mlr.press/v202/son23a/son23a.pdf#page=8)

### Curator Notes

- This is **specialist constructive** adaptation: different tasks use different pretrained checkpoints, and adaptation generates complete new candidates.
- The schedules are specified hyperparameters, not a learned schedule generator. The old note incorrectly suggested meta-training itself consists of scheduled scale changes.
- Limited numbers of updates can still cost many GPU hours. Teacher-embedding generation, SML training, augmentation and the backbone's original training are additional resources.
- Main and appendix descriptions abstract the insertion at different levels; the detailed residual-query implementation and scale-dependent sampling counts matter for reproduction.

## Reproducibility

- **Reading:** all 17 pages of the formal PMLR PDF were reread, including Appendices A-D.3. The publisher landing page lists this integrated PDF and an OpenReview record; no separate supplement is linked. OpenReview page and both API endpoints return a challenge/403. All scientific appendices referenced by the paper are present and read; no inaccessible extra attachment is claimed to have been inspected. [PMLR record.](https://proceedings.mlr.press/v202/son23a.html)
- **Metadata:** four authors are at KAIST. The publisher gives ICML/PMLR 202, 32194-32210, July 2023; arXiv history starts 5 June 2023, with v2 on 7 June. Generic conference notification-day acceptance metadata was removed. OP and PCTSP were restored to the task list.
- **Code:** the abstract directly identifies [kaist-silab/meta-sage](https://github.com/kaist-silab/meta-sage), correcting the old claim that no author implementation was confirmed. Its full README was read: it documents data and embedding-target generation, separate POMO/Sym-NCO task directories, SML training and 200-update tests at sizes 200/500/1000. Paper and README training-instance counts differ as stated above. Experiments were not rerun.
- **Image:** complete Figure 2 was cropped from formal PDF p. 4; the frozen versus updated modules, Table 1, component ablation and schedule equations were visually checked.
