---
id: cada
short_title: CaDA
title: 'CaDA: Cross-Problem Routing Solver with Constraint-Aware Dual-Attention'
authors:
- Han Li
- Fei Liu
- Zhi Zheng
- Yu Zhang
- Zhenkun Wang
year: 2025
date: '2024-11-30'
venue: ICML
paper_url: https://proceedings.mlr.press/v267/li25bi.html
arxiv_url: https://arxiv.org/abs/2412.00346
code_url: https://github.com/CIAM-Group/CaDA
institutions:
- Southern University of Science and Technology
- City University of Hong Kong
scope: generalist
paradigm: constructive
problem_families:
- Routing
problems:
- Capacitated Vehicle Routing Problem
- Open Vehicle Routing Problem
- Vehicle Routing Problem with Backhauls
- Vehicle Routing Problem with Time Windows
- Vehicle Routing Problem with Duration Limits
- Multi-Depot Vehicle Routing Problem
- Vehicle Routing Problem with Mixed Backhauls
summary: Constraint prompts and interacting global/Top-k attention branches train shared constructive policies for
  sixteen VRP variants; unseen-constraint experiments distinguish zero-shot decoding, prompt enumeration and target-task
  fine-tuning.
figure:
  path: paper-assets/cada/framework.png
  alt: CaDA constraint prompt, global/sparse attention branches, feature exchange and routing decoder.
  caption: 'Figure 2: the original CaDA pipeline from the formal ICML paper.'
  source_url: https://raw.githubusercontent.com/mlresearch/v267/main/assets/li25bi/li25bi.pdf#page=4
publication:
  date: '2025-10-06'
  source_url: https://proceedings.mlr.press/v267/li25bi.html
---

# CaDA: Cross-Problem Routing Solver with Constraint-Aware Dual-Attention

> **TL;DR:** A constraint prompt and interacting global/sparse attention branches train one policy over sixteen routing variants. It improves the reported average gaps, with exceptions at 100 nodes; new-constraint results distinguish ordinary decoding, 32-prompt search and target-task fine-tuning.

## Motivation

Different routing constraints change which node connections are useful, even when coordinates and customer features look similar. CaDA adds explicit instance-level constraint information to the encoder and combines global context with attention-selected connections. The authors' attention-distribution plots are empirical diagnostics; they do not prove that prior models cannot represent constraints. [pp. 1–4, 8, 14, 18–19]

## Contributions

- Embeds a five-bit constraint vector for capacity, open routes, time windows, duration limits and backhauls into a prompt.
- Runs interacting global and Top-k attention branches, with linear feature exchange, RMSNorm, residual connections and SwiGLU feed-forward blocks.
- Tests sixteen trained variants, real CVRPLib instances, and unseen multi-depot/mixed-backhaul constraints, with separate ablations for prompt placement, attention operation and k. [pp. 4–9, 16–19]

## Methodology

The encoder embeds depot/customer attributes and a constraint prompt. A global branch attends broadly, while a sparse branch selects connections by learned attention scores, not nearest-neighbour distance. The default k is N/2. The paper describes the global output as the decoder representation; the current code returns a fused sparse-branch representation, as qualified below.

A POMO-style autoregressive decoder uses the last visited node, remaining linehaul/backhaul capacities, time, route length and open-route status. It chooses the next feasible customer or route transition under explicit masks. REINFORCE with the shared POMO baseline trains N different starting-customer trajectories per instance. [pp. 3–5, 15–16]

**Classification:** Generalist / constructive. Sixteen native VRP constraint combinations share a policy, with separate checkpoints for sizes 50 and 100. Enumerating prompts chooses among newly constructed solutions; it is not a learned incumbent-editing operator. New constraints still require the appropriate environment/masks, and the multi-depot fine-tuning curves are not unchanged-checkpoint results.

## Experiments

- **Training:** Sixteen variants in mixed batches; 300 epochs × 100,000 instances = 30 million instances per model, batch 256, AdamW at 3×10⁻⁴ with decay at epochs 270/295. The model has six encoder layers, 128-dimensional embeddings, eight heads and approximately 3.4 million parameters. Reported training time is about 17/25 hours for 50/100 nodes on the RTX 3090 / Xeon Gold 6348 platform. MVMoE and RF-MoE use published pretrained weights because of memory requirements; other compared policies are retrained. [pp. 5–7, 18]
- **Synthetic tasks:** 1,000 test instances per variant, POMO greedy decoding with eightfold geometric augmentation. Figure 3 reports mean gaps of approximately 1.71%/2.81% at 50/100 nodes. CaDA leads the listed neural methods on all sixteen 50-node tasks and thirteen of sixteen 100-node tasks. At 100 nodes, its CVRP/OVRP/VRPB gaps are 1.578%/4.045%/4.038%, worse than RF-TE's 1.524%/3.996%/3.906%. Table 1 times cover the whole test dataset. The classical comparison uses one CPU core and 10/20-second limits for 50/100-node instances; starred references are the best listed heuristics, not optimality certificates. [pp. 5–7]
- **Unseen constraints:** At 50 nodes, multi-depot tests add three depots to sixteen variants; mixed-backhaul tests cover eight variants. Ordinary CaDA reports 39.34%/8.46% mean gaps. CaDA×32 enumerates all five-bit prompt combinations and selects the best solution, improving these to 28.86%/7.40% at additional inference cost. Multi-depot adaptation uses ten epochs of 10,000 examples, batch 128 and learning rate 3×10⁻⁴. [pp. 8–9]
- **Real instances:** Ninety-nine CVRPLib instances from A/B/F/P/X, sizes 16–200, use the 100-node-trained model. The reported five-set mean gaps are 4.17% for CaDA with k=25 and 3.32% with the additional 32-prompt search. Ordinary CaDA does not lead every set: RF-POMO is better on A, RF-MoE on P, and RF-TE on X. k=25 is selected using results on this same benchmark; a held-out selection split is not stated. [pp. 18–19]
- **Ablations:** Removing the prompt changes the mean gap from 1.714% to 1.926%; replacing sparse attention by a second ordinary-attention branch gives 1.795%. Prompt placement, sparsemax/entmax and k are also compared. These results do not remove the extra model-size and search-budget differences against every baseline. [pp. 7–8]

## Limitations

### Reported by the Authors

- Zero-shot transfer to multi-depot constraints remains poor for all evaluated methods; the study therefore also measures target-task fine-tuning. [p. 9]

### Curator Notes

- The study does not establish arbitrary new-constraint generalization or uniform superiority over all neural/classical methods. The global branch and dense score computation remain quadratic; Top-k with k=N/2 is not a linear-complexity encoder.
- Printed Eqs. (10)–(11) set excluded attention logits to zero before Softmax, which would leave positive weights. Both released model files instead use −∞ before Softmax, producing the intended zeros. Appendix B.3's service-completion time-window formula also differs from the released mask, which checks service start within the customer window. Appendix C.1 reverses demand signs relative to the main text; the code stores separate nonnegative linehaul/backhaul demands. Use the actual environment convention when reproducing the results.
- The public implementation is not a literal transcription of all architecture equations: its 50-node prompt network emits five tokens and its 100-node network emits one, with deeper prompt MLPs; both return the fused sparse stream rather than the global stream named in the prose. These are version/interface observations, not evidence that the published measurements are invalid.
- Table 7's printed MVMoE average objective is 919.8, whereas the arithmetic mean of its five displayed set objectives is 6432.84. Retain the reported gaps without silently inventing a corrected experiment. Table 6 also contains a k=75 row omitted from its stated set of k values.

## Reproducibility

- **Published paper:** [ICML / PMLR 267](https://proceedings.mlr.press/v267/li25bi.html); all nineteen pages, references and complete Appendices A–C were read. The [author preprint](https://arxiv.org/abs/2412.00346) was first submitted on 2024-11-30. PMLR's publication metadata gives 2025-10-06; generic conference notification dates were removed.
- **Official materials:** [CaDA code](https://github.com/CIAM-Group/CaDA), [data and checkpoints](https://huggingface.co/datasets/Goodyee/CaDA), and the [official conference poster page](https://icml.cc/virtual/2025/poster/46063). All scientific content on the poster PNG was visually read. It repeats the main architecture/results and adds a prompt-interaction illustration. The 32-member source archive and the six-member checkpoint / 677-member data archives were inventoried: no additional scientific PDF, notebook or nested archive was present. The publisher lists only the main PDF; OpenReview's API returned 403.
- **Implementation check:** Read the root and size-specific READMEs, prompt networks, attention/mixing paths, SwiGLU implementation and the 50-node feasibility/reward code, with corresponding 100-node paths checked. The release provides separate size directories and external checkpoints. No full training or benchmark reproduction was performed; match checkpoint version, k, prompt enumeration, augmentation and target adaptation when comparing results.
