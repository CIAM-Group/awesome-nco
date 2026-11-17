---
id: ar2l-bin-packing
short_title: AR2L
title: Adjustable Robust Reinforcement Learning for Online 3D Bin Packing
authors:
- Yuxin Pan
- Yize Chen
- Fangzhen Lin
year: 2023
date: '2023-12-15'
publication:
  date: '2023-12-15'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2023/hash/a345ed605675c7c484e740a8ceaa6b45-Abstract-Conference.html
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/2023/hash/a345ed605675c7c484e740a8ceaa6b45-Abstract-Conference.html
institutions:
- The Hong Kong University of Science and Technology
- The Hong Kong University of Science and Technology (Guangzhou)
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Packing
problems:
- Online 3D Bin Packing
summary: A finite-lookahead permutation attacker and alternating PPO training trade nominal online 3D packing utilization
  against performance under learned adverse arrival orders.
code_url: https://github.com/panyxy/ar2l_bpp
---

# Adjustable Robust Reinforcement Learning for Online 3D Bin Packing

> **TL;DR:** AR2L trains online packing, arrival-order attack and mixture policies to balance nominal and attacked utilization. The balance is empirical and setting dependent; the learned attacker is not a certificate over all possible orders. The printed discounted guarantees and KL formula need the qualifications below.

## Motivation

An online packer places items before seeing the full arrival sequence. A policy with high average utilization can fail on adverse orders, while purely adversarial training can lose nominal quality. The paper studies stable, nonoverlapping placement inside a single bin, maximizing terminal occupied-volume ratio until the next item cannot be packed. Its implemented objective is not the offline minimum-number-of-containers formulation used to introduce the broader problem (PDF1/3).

## Contributions

The paper introduces a learned finite-lookahead permutation attacker, a nominal-plus-adversarial return objective, and two training constructions. Exact AR2L explicitly learns mixture dynamics through another permutation policy. Approximate AR2L replaces that policy with a proposed dual value-update formulation using nominal and attacked samples. Discrete/continuous packing experiments and a zero-shot mixed-item dataset assess the nominal/robustness trade-off (PDF4-10/15-29).

This is **specialist/constructive**: the deployed neural policy repeatedly selects a feasible placement for the next item. Different observable-item counts, box-size distributions and robustness weights use configured training; the mixed-item experiment transfers a packing model to different geometries, rather than showing one checkpoint solving distinct native optimization problems. The attacker and mixture model are training components, not additional native tasks solved by the deployment checkpoint.

## Methodology

The state contains packed-item coordinates/sizes, the next NB observed items and feasible placement candidates. At each step, the attacker selects one observed item and moves it to the front; remaining items keep their relative order. The packer then places that item, and one new item enters the observable window. The attacker maximizes negative packing return. NB limits attack capacity, so it cannot freely choose any permutation of an arbitrarily long unseen sequence, change item geometry or perturb physics (PDF3-5).

The objective is eta(pi, nominal)+alpha eta(pi, worst), with alpha in (0,1] in the stated formulation. The named worst dynamics are instantiated by a trained attacker, not a certified globally optimal one. Theorem1 relates this objective to return under mixture dynamics minus total-variation discrepancy penalties. The method then uses a surrogate optimization and a per-state/action rectangular uncertainty set. Exact AR2L alternates PPO updates for attacker, mixture and packer; the mixture receives packing reward and a divergence penalty. Approximate AR2L uses the proposed dual Bellman update and avoids explicitly training a mixture policy (PDF5-7/23-28).

The packing backbone follows Packing Configuration Trees. Empty-maximal-space heuristics propose discrete placements, while intersection points in the top view propose continuous placements. Physical stability filters restrict the action set. Transformers encode heterogeneous packed and observed items; the permutation policies use pooled attention features to score observed boxes. The release uses PPO with64parallel environments, rollout30and learning rate0.0003. The formal packing MDP has zero intermediate rewards and terminal utilization, with gamma=1 (PDF3/27-29).

## Experiments

The discrete bin is10x10x10with each box dimension in{1,2,3,4,5}; the continuous bin is1x1x1with horizontal dimensions uniform in[0.1,0.5] and vertical dimensions drawn from five discrete values to form supporting planes. Each test dataset has3,000instances of150items. Reported utilization standard deviations describe dispersion across those instances; AppendixA1 explicitly distinguishes them from error bars over independently retrained runs. Training/evaluation hardware is an RTX3090 and Xeon Gold5218R (PDF7/15).

In the initial attack comparison, packers observe one item while attackers observe5/10/15/20; PCT utilization falls from76.6% nominally to40.5% at attacker NB20, while constrained DRL falls from74.1% to51.0%. The later robust comparison instead lets the packer observe the same NB as its attacker. Its beta variable is the percentage of complete test instances attacked, not a per-step attack probability or the TV radius (Tables1-2; PDF8).

Exact AR2L generally improves over PCT under attacks while retaining better nominal quality than pure robust training, but no setting-independent dominance follows. At discrete NB20, Exact(alpha1) reports76.1% nominal/58.5% fully attacked, versus PCT77.0%/41.9% and RARL72.0%/58.7%. In the continuous NB20 setting, Exact(alpha1) gives64.9%/37.4%, compared with PCT65.8%/35.9% and RARL62.7%/41.0%. These rows show the remaining robustness/nominal-quality trade-off. Approximate AR2L can outperform Exact AR2L at NB5, and increasing alpha does not monotonically improve nominal quality (main Table2; Appendix Table2).

The mixed-item experiment applies the model without retraining to10,000items/4,668types and a120x100x100pallet. At NB20, AR2L utilization is52.9% versus48.7% for PCT and48.8% for RARL; at NB15 the respective values are50.2%,48.3%,48.8%. Figures inspect attack-induced item-size distributions, packing layouts and convergence in update counts. Small-items-first ordering alone is not an optimal attack, as the four-item support-plane example illustrates. The reimplemented PCT is compared with its original implementation using matched rollout/process settings; these plots do not establish equal end-to-end wall-clock training cost (PDF16-22).

## Limitations

Robustness is relative to finite-lookahead learned attacks and the modeled placement/stability constraints. PPO can find locally effective policies without proving globally worst arrival orders or optimal packing. New alpha values are training choices, not evidence for an inference-time preference-conditioned policy. Mixture-policy training adds computation; the approximate value update can be unstable and performs differently across settings. Distribution transfer on synthetic/realistic item data is not a robot deployment trial (PDF10/19-20).

### Curator Notes

**Discounted theory versus the experimental setting.** Theorem1's coefficient contains(1-gamma)^-2, and the fixed-point proof for Theorem2 establishes a gamma-Lipschitz bound before invoking strict contraction/uniqueness. Those standard arguments need gamma<1; at the explicitly chosen gamma=1 they do not supply the claimed strict-contraction guarantee. Finite terminating packing can be treated separately, but the printed discounted proof is not such a finite-horizon proof. This qualification does not imply that the episodic implementation or empirical results fail (PDF3/5/23-25).

**KL direction in print versus code.** Equation6 and Algorithm1 print KL(mix||delta_first)+alpha KL(mix||attacker). Taken literally, the first term is infinite when mix assigns positive mass to any other item. The publisher ZIP and pinned GitHub `ppo.py:583-596` instead compute negative log probability of the first item plus PyTorch `KLDivLoss(log_mix,log_attacker)`: KL(delta_first||mix)+alpha KL(attacker||mix). For mix=(0.5,0.5), attacker=(0.8,0.2), alpha=0.5, the released primitives give finite loss0.7895195591, whereas the printed first KL is infinite. This is a specific formula/implementation discrepancy, not a packing benchmark rerun. AppendixA2 also contains inconsistent coupling coefficients and an unstated domain in intermediate conjugate formulas; its printed dual derivation should not be treated as an independently verified general guarantee without clarifying those conditions (PDF6/25-27).

## Reproducibility

- All29pages of the [formal NeurIPS2023 paper](https://proceedings.neurips.cc/paper_files/paper/2023/file/a345ed605675c7c484e740a8ceaa6b45-Paper-Conference.pdf) were read, including the full bibliography and all scientific appendices. Twenty-three key pages were rendered and checked, covering every figure/table, both algorithms and the central proofs. Publisher metadata confirms three authors, volume36, pages51926-51954and DOI10.52202/075280-2262. The [publisher metadata](https://proceedings.neurips.cc/paper_files/paper/2023/hash/a345ed605675c7c484e740a8ceaa6b45-Abstract-Conference.html) explicitly records `citation_publication_date` as **2023-12-15**, independently of any paper-specific acceptance date.
- The publisher's supplemental ZIP was fully downloaded and its74members inventoried: excluding directories/AppleDouble entries, it has44files, including33Python files and six shell scripts, with no separate scientific PDF or checkpoints. The integrated29-page paper contains the scientific appendix. Both OpenReview APIs for`1mdTYi1jAW` returned403. No explicitly referenced scientific appendix is missing from the reviewed PDF.
- The [official repository](https://github.com/panyxy/ar2l_bpp) was inspected at`7c012b427abab572c04195f0da761ef334c4868a`:45files, including four dataset tensors, no scientific PDF/ZIP and no released model checkpoints. The complete README, training entry point, central PPO losses/alternation, environment reward, evaluation interface, action-log-probability sections and shell configurations were checked. Its PPO file matches the publisher ZIP byte-for-byte. The inspected tree provides the exact alternating-policy variant; no approximate dual-update implementation was identified. Dependencies pin PyTorch1.10/Gym0.15.7/Numpy1.21.6. README script paths require correction, and several README alpha examples exceed the printed interval.
- The author's linked147-second YouTube item is labeled a qualitative video demonstration. Its landing page/player metadata were retrieved, but supplied adaptive-format metadata had no downloadable stream URLs; video/audio were not acquired or counted as read scientific material. No scientific claim in this note depends on it. A local primitive KL check was executed; no full training, packing benchmark or historical table reproduction was run.
- Five catalogue relations have explicit body citations and matching bibliography entries. Sources, actual page coverage, rendered views, archive/code inventories and the bounded loss check remain in the review evidence.
